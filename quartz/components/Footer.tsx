import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface FooterOptions {
  links?: Record<string, string>
}

const Footer: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  const currentYear = new Date().getFullYear()
  const links: Record<string, string> = {
    "tavrida.ru": "https://www.tavrida.ru/ter/",
    "VK": "https://vk.ru/tavrida_electric",
    "MAX": "https://max.ru/id7714418269_biz",
  }

  return (
    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <p>© {currentYear} Таврида Электрик</p>
        </div>
        <div class="footer-right">
          <ul class="footer-links">
            {Object.entries(links).map(([name, url]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

Footer.css = `
footer {
  margin-top: 4rem;
  padding: 2rem;
  border-top: 1px solid var(--lightgray);
  text-align: center;
  font-size: 0.9em;
  color: var(--gray);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  max-width: 90%;
  margin: 0 auto;
}

.footer-left {
  flex: 1;
  text-align: left;
  min-width: 200px;
}

.footer-left p {
  margin: 0;
  font-size: 0.9em;
}

.footer-right {
  flex: 1;
  text-align: right;
  min-width: 200px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1.5rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.footer-links li {
  display: inline;
}

.footer-links a {
  color: var(--gray);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--secondary);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .footer-left,
  .footer-right {
    text-align: center;
    width: 100%;
  }

  .footer-links {
    justify-content: center;
  }
}
`

export default (() => Footer) satisfies QuartzComponentConstructor
