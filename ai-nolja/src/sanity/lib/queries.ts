import { defineQuery } from 'next-sanity'

export const HERO_QUERY = defineQuery(`*[_type == "hero"][0]{
  headline,
  subhead,
  backgroundImage
}`)

export const LECTURES_QUERY = defineQuery(`*[_type == "lecture"] | order(_createdAt desc){
  _id,
  title,
  description,
  image,
  tags,
  duration,
  level,
  price,
  isLocked,
  slug
}`)

export const TOOLS_QUERY = defineQuery(`*[_type == "tool"] | order(_createdAt desc){
  _id,
  name,
  description,
  link,
  category
}`)
