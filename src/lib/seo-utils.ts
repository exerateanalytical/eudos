// SEO utility functions for production-ready implementation

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  structuredData?: object;
}

// Generate JSON-LD structured data for products
export function generateProductStructuredData(product: {
  name: string;
  description: string;
  price?: number;
  currency?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
}) {
  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
  };

  if (product.image) {
    structuredData.image = product.image;
  }

  if (product.price && product.currency) {
    structuredData.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
    };
  }

  if (product.rating && product.reviewCount) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return structuredData;
}

// Generate JSON-LD structured data for articles/blog posts
export function generateArticleStructuredData(article: {
  title: string;
  description: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: article.author
      ? {
          '@type': 'Person',
          name: article.author,
        }
      : undefined,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    image: article.image,
  };
}

// Generate JSON-LD structured data for organization
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SecureDoc Solutions',
    url: window.location.origin,
    logo: `${window.location.origin}/og-image.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'en',
    },
  };
}

// Generate JSON-LD structured data for FAQs
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Generate optimized meta title (max 60 characters)
export function optimizeTitle(title: string, siteName = 'SecureDoc Solutions'): string {
  const maxLength = 60;
  const separator = ' | ';
  
  if (title.includes(siteName)) {
    return title.length <= maxLength ? title : title.substring(0, maxLength - 3) + '...';
  }

  const fullTitle = `${title}${separator}${siteName}`;
  
  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }

  const availableLength = maxLength - separator.length - siteName.length - 3;
  return `${title.substring(0, availableLength)}...${separator}${siteName}`;
}

// Generate optimized meta description (max 160 characters)
export function optimizeDescription(description: string): string {
  const maxLength = 160;
  
  if (description.length <= maxLength) {
    return description;
  }

  return description.substring(0, maxLength - 3) + '...';
}

// Clean and optimize keywords
export function optimizeKeywords(keywords: string[]): string {
  return keywords
    .filter((keyword) => keyword.trim().length > 0)
    .map((keyword) => keyword.trim().toLowerCase())
    .slice(0, 10) // Limit to 10 keywords
    .join(', ');
}
