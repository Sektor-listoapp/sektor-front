import type { NextApiRequest, NextApiResponse } from "next";

type HomeQuotesCountResponse = {
  count: number | null;
};

const QUOTES_COUNT_QUERY = `
  query getHomeQuotesCount {
    quotes(pagination: { offset: 0, limit: 1 }) {
      count
    }
  }
`;

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<HomeQuotesCountResponse>
) {
  const token = process.env.SEKTOR_ADMIN_TOKEN;
  const apiUrl = process.env.NEXT_PUBLIC_SEKTOR_API_URL;

  if (!token || !apiUrl) {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    return res.status(200).json({ count: null });
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: QUOTES_COUNT_QUERY }),
    });

    const json = (await response.json()) as {
      data?: { quotes?: { count?: number } };
    };

    const count =
      typeof json.data?.quotes?.count === "number"
        ? json.data.quotes.count
        : null;

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    return res.status(200).json({ count });
  } catch {
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    return res.status(200).json({ count: null });
  }
}
