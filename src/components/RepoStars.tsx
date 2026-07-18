import { useEffect, useState } from 'react';

/* Proof that slides are live web apps: fetches the bolt-slides repo's star
   count from the GitHub API when the slide mounts. Renders an em dash until
   (or unless) the network answers — a paged slide should never block. */
export default function RepoStars() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    let on = true;
    fetch('https://api.github.com/repos/stackblitz/bolt-slides')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (on && d && typeof d.stargazers_count === 'number')
          setStars(d.stargazers_count);
      })
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      ★ {stars == null ? '—' : stars.toLocaleString('en-US')}
    </span>
  );
}
