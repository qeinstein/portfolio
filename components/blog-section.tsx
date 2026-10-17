import { mediumPosts } from "@/lib/blog-posts";

export function BlogSection() {
  return <section id="blog" className="content-section blog-section" aria-labelledby="blog-title">
    <div className="section-heading">
      <h2 id="blog-title">Blog and News</h2>
    </div>
    <div id="blog-posts" className="blog-scroll" role="region" aria-label="Blog posts, scroll horizontally for more" tabIndex={0}>
      {mediumPosts.map(post => <article className="blog-entry" key={post.link}>
        <a className="blog-cover" href={post.link} target="_blank" rel="noreferrer" aria-label={`Read ${post.title}`}>
          <img src={post.image} alt="" width={180} height={150} loading="lazy" />
        </a>
        <time dateTime={post.datetime}>{post.date}</time>
        <h3><a href={post.link} target="_blank" rel="noreferrer">{post.title}</a></h3>
        <a className="blog-read" href={post.link} target="_blank" rel="noreferrer" aria-label={`Read ${post.title} on Medium`}>
          <span>Read</span>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M6 14 14 6M8 6h6v6" />
          </svg>
        </a>
      </article>)}
    </div>
  </section>;
}
