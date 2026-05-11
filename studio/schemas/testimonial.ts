export default {
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    {
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
    },
    {
      name: 'reviewText',
      title: 'Review Text',
      type: 'text',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      options: { list: [1, 2, 3, 4, 5] },
    },
    {
      name: 'image',
      title: 'Optional Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
  ],
}
