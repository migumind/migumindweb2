// Dev-only preview stamps for the community gallery: the first two drawings sent in
// from the contact page, credited anonymously and numbered in the order they came in.
// Shown only in local dev while Sanity has no community drawings; never in a production build.
import type {CommunityDrawing} from './sanity'

const FIRST =
  '166666666662220868888888868212286222222286821128621121128682212862111112888211286214141222221228621111111111128862111111111122866222111111112886a882111111112866a68211122111286aa68211122111286ab68211122111286ab68222222222286ab68888888888886ab66666666666666ab'
const SECOND =
  '1bbb77b77b77b77bb77711711711711777b177277177277b77712222222222177b71211122211117bbb121411211411bb6b121441214411bb66121111211111bb66121111211111b6661222221222216666122222222221666111212121011166112212121211a116122222222221aa11122222222211aaa111111111111aaaa1'

// Newest first, the way the gallery lists them; _createdAt sets the stamp numbers.
export const SAMPLE_DRAWINGS: CommunityDrawing[] = [
  {_id: 'sample-2', _createdAt: '2026-10-17T00:00:02Z', drawing: SECOND, received: '2026-10-17'},
  {_id: 'sample-1', _createdAt: '2026-10-17T00:00:01Z', drawing: FIRST, received: '2026-10-17'},
]
