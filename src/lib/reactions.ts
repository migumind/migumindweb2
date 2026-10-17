// Emoji reactions on the community gallery. Must match EMOJI in workers/reactions.
export const REACTIONS = ['🔥', '❤️', '😂', '🤯', '🎨'] as const

export const REACTION_LABELS: Record<string, string> = {
  '🔥': 'Fire',
  '❤️': 'Love',
  '😂': 'Funny',
  '🤯': 'Mind blown',
  '🎨': 'Art',
}

/** The reactions Worker's URL (workers/reactions). Unset = no reaction buttons on the live site. */
export const REACTIONS_ENDPOINT: string = import.meta.env.PUBLIC_REACTIONS_ENDPOINT ?? ''

/** In dev the buttons render without an endpoint and count locally, so the design can be reviewed. */
export const REACTIONS_ENABLED = Boolean(REACTIONS_ENDPOINT) || import.meta.env.DEV
