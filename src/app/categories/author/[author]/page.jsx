import BlogCard from "@/components/BlogCard";
import { getPostsByAuthor } from "@/lib/serverMethods/blog/postMethods";

export const revalidate = 60

export default async function page({ params }) {
  const { author} = await params;
  const postsData = await getPostsByAuthor(author);


  return (
    <main className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Posts from {postsData.author.userName} 👤</h1>
      <p className="t-main-subtitle">All the posts written by this user :</p>
      <p className="mr-4 text-md text-zinc-900">Latest articles</p>
      <ul className="u-articles-grid">
        {postsData.posts.length > 0 ? (
          postsData.posts.map((post) => <BlogCard key={post._id} post={post} />)
        ) : (
          <li>No articles found for that author 🤖</li>
        )}
      </ul>
    </main>
  );
}
