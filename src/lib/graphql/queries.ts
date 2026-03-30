// ── Shared types ─────────────────────────────────────────────────────────────

export type ShowcaseProject = {
  id: string
  title: string
  category: string
  description: string | null
  long_description: string | null
  gradient: string
  accent: string
  image_url: string | null
  image_position: string | null
  image_urls: string[] | null
  tags: string[] | null
  client: string | null
  year: string | null
  link_url: string | null
  visible: boolean
  display_order: number | null
}

export type TeamMember = {
  id: string
  name: string
  role: string
  bio: string | null
  photo_url: string | null
  photo_position: string | null
  tag: string | null
  linkedin_url: string | null
  twitter_url: string | null
  website_url: string | null
  display_order: number | null
}

// ── Response wrappers ─────────────────────────────────────────────────────────

export type GQLEdge<T> = { node: T }

export type GetShowcaseProjectsRes = {
  showcase_projectsCollection: { edges: GQLEdge<ShowcaseProject>[] }
}

export type GetProjectByIdRes = {
  showcase_projectsCollection: { edges: GQLEdge<ShowcaseProject>[] }
}

export type GetAllProjectIdsRes = {
  showcase_projectsCollection: {
    edges: GQLEdge<{ id: string; updated_at: string | null }>[]
  }
}

export type GetTeamMembersRes = {
  team_membersCollection: { edges: GQLEdge<TeamMember>[] }
}

// ── Queries ───────────────────────────────────────────────────────────────────

export const GET_SHOWCASE_PROJECTS = /* GraphQL */ `
  query GetShowcaseProjects {
    showcase_projectsCollection(
      filter: { visible: { eq: true } }
      orderBy: [{ display_order: AscNullsLast }]
      first: 5
    ) {
      edges {
        node {
          id
          title
          category
          description
          long_description
          gradient
          accent
          image_url
          image_position
          image_urls
          tags
          client
          year
          link_url
          visible
          display_order
        }
      }
    }
  }
`

export const GET_PROJECT_BY_ID = /* GraphQL */ `
  query GetProjectById($id: UUID!) {
    showcase_projectsCollection(
      filter: { id: { eq: $id }, visible: { eq: true } }
      first: 1
    ) {
      edges {
        node {
          id
          title
          category
          description
          long_description
          gradient
          accent
          image_url
          image_position
          image_urls
          tags
          client
          year
          link_url
          visible
          display_order
        }
      }
    }
  }
`

export const GET_ALL_PROJECT_IDS = /* GraphQL */ `
  query GetAllProjectIds {
    showcase_projectsCollection(
      filter: { visible: { eq: true } }
      orderBy: [{ display_order: AscNullsLast }]
    ) {
      edges {
        node {
          id
          updated_at
        }
      }
    }
  }
`

export const GET_TEAM_MEMBERS = /* GraphQL */ `
  query GetTeamMembers {
    team_membersCollection(
      filter: { visible: { eq: true } }
      orderBy: [{ display_order: AscNullsLast }]
    ) {
      edges {
        node {
          id
          name
          role
          bio
          photo_url
          photo_position
          tag
          linkedin_url
          twitter_url
          website_url
          display_order
        }
      }
    }
  }
`

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Unwrap edges → array of nodes */
export function unwrapEdges<T>(edges: GQLEdge<T>[] | undefined): T[] {
  return (edges ?? []).map(e => e.node)
}
