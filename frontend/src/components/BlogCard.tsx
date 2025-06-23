import Image from 'next/image';
import { type BlogPost } from '@/services/blogService';

interface BlogCardProps {
  post: BlogPost;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const BlogCard = ({ post }: BlogCardProps) => {
  const { title, excerpt, image, author, publishedAt } = post;
  const formattedDate = formatDate(publishedAt);

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {image && (
        <div className="relative h-48">
          <Image
            src={image.url}
            alt={image.altText || title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors duration-200">
          {title}
        </h2>
        {excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3 text-base">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          {author && (
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {author.name}
            </span>
          )}
          <time dateTime={publishedAt} className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formattedDate}
          </time>
        </div>
      </div>
    </article>
  );
}; 
