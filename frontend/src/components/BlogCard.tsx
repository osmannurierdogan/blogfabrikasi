import { BlogPost } from '../services/blogService';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.image && (
        <div className="relative h-48 w-full">
          <img
            src={post.image.url}
            alt={post.image.altText || post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formattedDate}</span>
          {post.author && <span>{post.author.name}</span>}
        </div>
      </div>
    </article>
  );
} 
