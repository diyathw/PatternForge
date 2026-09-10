/**
 * Problem shapes for String Algorithms + Bit Manipulation + Mathematical
 * Algorithms (Agent 1, Track 6 of 7).
 *
 * SKELETON PASS ONLY — `contentStatus: "skeleton"` throughout. Candidate
 * pattern ids reference nodes minted in `stringsMathNodes.ts`; a couple
 * (`expand-around-center`, `dynamic-programming`) reference ids expected to
 * be owned by other tracks and are left dangling on purpose for the later
 * integration pass.
 */
import type { ProblemShape } from "../../types/domain"

export const problemShapes: ProblemShape[] = [
  {
    id: "prefix-search",
    type: "problem-shape",
    name: "Prefix Search",
    category: "problem-shapes",
    difficulty: "core",
    interviewFrequency: "high",
    recognitionClues: [
      "does any word in the dictionary start with this prefix",
      "autocomplete / type-ahead suggestions",
      "add and search word with prefix lookups",
    ],
    recognitionWords: [
      "starts with",
      "prefix",
      "autocomplete",
      "dictionary of words",
      "type-ahead",
    ],
    candidatePatternIds: ["trie", "prefix-trie"],
    disambiguation:
      "If queries are only 'does this exact word exist' with no prefix matching, a plain hash set is simpler and just as fast. Reach for a trie specifically when queries need prefix-level matching (starts-with, prefix counting, wildcard search) or when many words share prefixes and you want to avoid re-comparing shared characters repeatedly.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "multiple-string-pattern-search",
    type: "problem-shape",
    name: "Multiple String Pattern Search",
    category: "problem-shapes",
    difficulty: "specialist",
    interviewFrequency: "low",
    recognitionClues: [
      "search a text for any of many patterns at once",
      "keyword/profanity filtering against a dictionary",
      "find all occurrences of every pattern in a list, in one pass over the text",
    ],
    recognitionWords: [
      "multiple patterns",
      "dictionary of keywords",
      "find all matches",
      "list of banned words",
    ],
    candidatePatternIds: ["aho-corasick"],
    disambiguation:
      "Running KMP or a rolling hash once per pattern costs O(k * (n + m)) for k patterns — fine for a handful of patterns, but Aho-Corasick builds one automaton over all patterns and scans the text once in O(n + total pattern length + matches), which wins decisively once k grows past a small constant.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "repeated-string-matching",
    type: "problem-shape",
    name: "Repeated String Matching",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "medium",
    recognitionClues: [
      "find all occurrences of a pattern inside a text",
      "does the text contain this substring, and where",
      "compare many substrings for equality efficiently",
    ],
    recognitionWords: [
      "substring search",
      "pattern occurs in text",
      "find all occurrences",
      "contains substring",
    ],
    candidatePatternIds: ["kmp", "z-algorithm", "rolling-hash", "rabin-karp"],
    disambiguation:
      "KMP and the Z algorithm are deterministic O(n + m) with no risk of false positives — prefer them when correctness must be guaranteed and pattern/text sizes are modest. Rolling hash (Rabin-Karp) is simpler to implement and generalizes easily to 2D/multi-pattern variants, but carries a (small, manageable-with-double-hashing) collision risk, so it's the pragmatic choice for quick implementation or when combining hashes across many substrings, not when adversarial inputs are a concern.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
  {
    id: "palindrome-substring-queries",
    type: "problem-shape",
    name: "Palindrome Substring Queries",
    category: "problem-shapes",
    difficulty: "intermediate",
    interviewFrequency: "medium",
    recognitionClues: [
      "longest palindromic substring",
      "count palindromic substrings",
      "is substring[i..j] a palindrome, asked many times",
    ],
    recognitionWords: [
      "palindrome",
      "palindromic substring",
      "longest palindrome",
      "count palindromes",
    ],
    candidatePatternIds: ["manachers-algorithm", "expand-around-center", "dynamic-programming", "palindromic-tree"],
    disambiguation:
      "For a single 'longest palindromic substring' query, expand-around-center is O(n^2) but simple and usually fast enough; Manacher's algorithm gets the same answer in O(n) when n is large enough to matter. A DP table (palindrome[i][j]) is the right choice when you need O(1) palindrome lookups for many arbitrary (i, j) ranges after O(n^2) preprocessing. Reach for a palindromic tree (eertree) specifically when you need to enumerate or count every distinct palindromic substring, not just the longest one.",
    languageTemplatesAvailable: ["javascript", "python"],
    contentStatus: "skeleton",
  },
]
