"use server";

import {
  connectToDB,
  User,
  slugify,
  bcrypt,
  Session,
  cookies,
  AppError,
  revalidateTag,
} from "./index.js";

export async function register(formData) {
  const { userName, email, password, confirmPassword } =
    Object.fromEntries(formData);

  try {
    if (typeof userName !== "string" || userName.trim().length < 3) {
      throw new AppError("Username must be at least 3 characters long.");
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+\=\[\]{};:'",.<>\/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+\=\[\]{};:'",.<>\/?\\|`~]{8,64}$/;
    if (
      typeof password !== "string" ||
      password.trim().length < 8 ||
      !passwordRegex.test(password.trim())
    ) {
      throw new AppError(
        password.trim().length < 8
          ? "Password must be at least 8 characters long."
          : "Password must contain at least 1 digit, 1 uppercase character and 1 special character and have a max of 64 characters"
      );
    }

    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email.trim())) {
      throw new AppError("Invalid email format.");
    }

    await connectToDB();

    const user = await User.findOne({ $or: [{ userName }, { email }] });

    if (user) {
      throw new AppError(
        user.userName === userName
          ? "Username already exists..."
          : "Email already exists..."
      );
    }

    const normalizedUserName = slugify(userName, { lower: true, strict: true });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      normalizedUserName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("User saved to db");

    return { success: true };
  } catch (err) {
    console.error("Error while registering :", err);
    if (err instanceof AppError) {
      return {message: err.message}
    }

    throw new Error("An error occured while registering.");
  }
}

export async function login(formData) {
  const { userName, password } = Object.fromEntries(formData);
  const invalidCredentialsMsg = "Invalid credentials";
  try {
    await connectToDB();
  }catch(err){
    console.error("Error while signing in : ", err.message);

    throw new Error(err.message);
  }

    const user = await User.findOne({ userName: userName });
    if (!user) {
      return { message: invalidCredentialsMsg };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { message: invalidCredentialsMsg };
    }

    let session;
    const existingSession = await Session.findOne({
      userId: user._id,
      expiresAt: { $gt: new Date() }, //$gt = greater than
    });
    if (existingSession) {
      session = existingSession;
      existingSession.expiresAt = newDate(Date.now() + 7 * 24 * 60 * 60 * 1000); //faire un utils ?
      await existingSession.save();
    } else {
      session = new Session({
        userId: user._id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await session.save();
    }
    if (!session) {
      return {
        message:
          "Failed to log in, if problem persists please contact support.",
      };
    }
    const cookieStore = await cookies();
    cookieStore.set("sessionId", session._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "Lax", // CSRF
    });
    revalidateTag("auth-session");

    return { success: true, userId: user._id.toString() };
  
}

export async function logOut() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  try {
    await Session.findByIdAndDelete(sessionId);

    (cookieStore.set("sessionId", ""),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0, //Delete cookie right away
        sameSite: "strict",
      });
    revalidateTag("auth-session");
    return { success: true };
  } catch (err) {
    console.log(err);
  }
}

export async function isPrivatePage(pathname) {
  const privateSegments = ["/dashboard", "/settings/profile"];

  return privateSegments.some(
    (segment) => segment === pathname || pathname.startsWith(segment + "/")
  );
}

export async function SASessionInfo() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return { success: false, userId: null };
  }

  await connectToDB();

  const session = await Session.findById(sessionId);

  if (!session || session.expiresAt < new Date()) {
    return { success: false, userId: null };
  }

  const user = await User.findById(session.userId);

  if (!user) {
    return { success: false, userId: null };
  }

  return { success: true, userId: user._id.toString() };
}
