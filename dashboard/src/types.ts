export type AccessType = 'public' | 'confidential'

export type ProjectImage = {
  id: number
  image_path: string
  caption?: string | null
}

export type Project = {
  id: number
  title: string
  short_description?: string | null
  details?: string | null
  cover_image?: string | null
  live_url?: string | null
  github_url?: string | null
  access_type: AccessType
  confidential_message?: string | null
  technologies?: string[]
  sort_order: number
  is_published: boolean
  images: ProjectImage[]
  popup: {
    details?: string | null
    images: ProjectImage[]
    can_open_live: boolean
    live_url?: string | null
    github_url?: string | null
    confidential_message?: string | null
    access_type: AccessType
  }
}

export type Testimonial = {
  id: number
  quote: string
  name: string
  title?: string | null
  avatar?: string | null
  sort_order: number
  is_published: boolean
}

export type Experience = {
  id: number
  title: string
  description?: string | null
  thumbnail?: string | null
  sort_order: number
  is_published: boolean
}

export type SocialLink = {
  id: number
  name: string
  url: string
  icon?: string | null
  sort_order: number
  is_published: boolean
}

export type Settings = {
  hero_label?: string | null
  hero_title?: string | null
  hero_subtitle?: string | null
  hero_image?: string | null
  footer_heading?: string | null
  footer_text?: string | null
  contact_email?: string | null
  copyright_text?: string | null
  cv_path?: string | null
  cv_original_name?: string | null
  confidential_default_message?: string | null
}

export type Stats = {
  projects: number
  published_projects: number
  confidential_projects: number
  testimonials: number
  experiences: number
  cv_uploaded: boolean
}
