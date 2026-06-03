interface Env {
  GITHUB_TOKEN?: string;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "steele-bz-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }

  const response = await fetch(
    "https://api.github.com/users/klsteele64-tech/repos?sort=updated&per_page=100",
    { headers },
  );

  if (!response.ok) {
    return Response.json(
      { error: "Failed to fetch GitHub repositories" },
      { status: response.status },
    );
  }

  const repos = (await response.json()) as GitHubRepo[];
  const publicRepos = repos
    .filter((repo) => !repo.fork)
    .map(({ name, description, html_url, language, stargazers_count }) => ({
      name,
      description,
      html_url,
      language,
      stargazers_count,
    }));

  return Response.json(publicRepos, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json",
    },
  });
};
