import { client } from "./client";
import { draftMode } from "next/headers";

export async function sanityFetch<const QueryString extends string>({
    query,
    params = {},
}: {
    query: QueryString;
    params?: Record<string, unknown>;
}) {
    const isDraftMode = (await draftMode()).isEnabled;

    if (isDraftMode) {
        return client.fetch(query, params, {
            token: process.env.SANITY_API_READ_TOKEN,
            perspective: "previewDrafts",
            stega: true,
        });
    }

    return client.fetch(query, params, {
        stega: false,
    });
}
