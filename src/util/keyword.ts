/* eslint-disable @typescript-eslint/camelcase */
import * as keywordExtractor from "keyword-extractor";

/**
 * Extração de palavras chaves
 */
export function extractKeyword(term: string): string {
    return keywordExtractor.extract(term, {
        language: "portuguese",
        remove_duplicates: true,
        return_chained_words: true
    }).toString().replace(/,/g, '|');
}