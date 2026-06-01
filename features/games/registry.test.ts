import { describe, expect, it } from "vitest";

import { games, getGameBySlug, playableGames } from "./game-registry";

describe("game registry", () => {
  it("has unique slugs", () => {
    const slugs = games.map((game) => game.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps playable games registered in launch order", () => {
    expect(playableGames).toHaveLength(2);
    expect(playableGames[0]?.slug).toBe("snake");
    expect(playableGames[1]?.slug).toBe("cipherword");
    expect(getGameBySlug("snake")?.status).toBe("playable");
    expect(getGameBySlug("cipherword")?.status).toBe("playable");
  });

  it("keeps placeholder games visibly unavailable", () => {
    expect(games.filter((game) => game.status === "coming-soon").length).toBeGreaterThan(0);
  });
});
