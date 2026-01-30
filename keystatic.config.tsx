import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
  kind: process.env.NODE_ENV === 'development' ? 'local' : 'github',
  repo: 'jtregenza/joshtregenza26',
},
ui: {
    brand: { name: 'Josh Tregenza'},
        navigation: {
        'Writing': ['musings'],
        'Work': ['projects', 'process'],
        'Voice': ['voice'],
        'Fun': ['lab'],
        'Settings': ['settings'],
        },
},
singletons: {
    settings: singleton({
      label: 'Site Settings',
      path: 'content/settings',
      schema: {
        tickerMessages: fields.array(
          fields.text({ label: 'Message' }),
          {
            label: 'Ticker Messages',
            itemLabel: props => props.value,
          }
        ),
      },
    }),
  },
    collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'content/projects/*',
       entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        date: fields.date({ label: 'Date' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: props => props.value,
          }
        ),
        liveUrl: fields.url({
          label: 'Live URL',
          validation: { isRequired: false },
        }),
        githubUrl: fields.url({
          label: 'GitHub URL',
          validation: { isRequired: false },
        }),
        videoUrl: fields.url({
          label: 'Video URL (YouTube/Vimeo)',
          validation: { isRequired: false },
        }),
        audioUrl: fields.url({
          label: 'Audio URL',
          validation: { isRequired: false },
        }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/projects',
              publicPath: '/images/projects/',
            },
          },
        }),
      },
    }),
    musings: collection({
      label: 'Musings',
      slugField: 'title',
      path: 'content/musings/*',
       entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        excerpt: fields.text({
          label: 'Excerpt',
          multiline: true,
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/images/musings',
          publicPath: '/images/musings/',
          validation: { isRequired: false },
        }),
        publishedDate: fields.date({ label: 'Published Date' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: props => props.value,
          }
        ),
        audioUrl: fields.url({
          label: 'Audio URL (for podcast-style musings)',
          validation: { isRequired: false },
        }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/musings',
              publicPath: '/images/musings/',
            },
          },
        }),
      },
    }),
    voice: collection({
      label: 'Voice',
      slugField: 'title',
      path: 'content/voice/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/images/voice',
          publicPath: '/images/voice/',
          validation: { isRequired: false },
        }),
        date: fields.date({ label: 'Date' }),
        audioUrl: fields.url({
          label: 'Audio/Demo Reel URL',
          validation: { isRequired: false },
        }),
        videoUrl: fields.url({
          label: 'Video URL (if applicable)',
          validation: { isRequired: false },
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags (e.g., commercial, narration, character)',
            itemLabel: props => props.value,
          }
        ),
        client: fields.text({
          label: 'Client/Project',
          validation: { isRequired: false },
        }),
        role: fields.text({
          label: 'Role/Character',
          validation: { isRequired: false },
        }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/voice',
              publicPath: '/images/voice/',
            },
          },
        }),
      },
    }),
    lab: collection({
      label: 'Lab',
      slugField: 'title',
      path: 'content/lab/*',
       entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/images/lab',
          publicPath: '/images/lab/',
          validation: { isRequired: false },
        }),
        date: fields.date({ label: 'Date' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags (e.g., experiment, prototype, research)',
            itemLabel: props => props.value,
          }
        ),
        videoUrl: fields.url({
          label: 'Video URL',
          validation: { isRequired: false },
        }),
        audioUrl: fields.url({
          label: 'Audio URL',
          validation: { isRequired: false },
        }),
        externalUrl: fields.url({
          label: 'External URL',
          validation: { isRequired: false },
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Prototype', value: 'prototype' },
            { label: 'In Progress', value: 'in-progress' },
            { label: 'Completed', value: 'completed' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'prototype',
        }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/lab',
              publicPath: '/images/lab/',
            },
          },
        }),
      },
    }),
    process: collection({
      label: 'Process',
      slugField: 'title',
      path: 'content/process/*',
       entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description',
          multiline: true,
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/images/process',
          publicPath: '/images/process/',
          validation: { isRequired: false },
        }),
        date: fields.date({ label: 'Date' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags (e.g., workflow, tutorial, behind-the-scenes)',
            itemLabel: props => props.value,
          }
        ),
        videoUrl: fields.url({
          label: 'Video URL',
          validation: { isRequired: false },
        }),
        audioUrl: fields.url({
          label: 'Audio URL',
          validation: { isRequired: false },
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Design/Development', value: 'design' },
            { label: 'Management', value: 'management' },
            { label: 'Coaching', value: 'coaching' },
            { label: 'Voice Acting', value: 'voice-acting' },
          ],
          defaultValue: 'design',
        }),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/images/process',
              publicPath: '/images/process/',
            },
          },
        }),
      },
    }),
  },
});