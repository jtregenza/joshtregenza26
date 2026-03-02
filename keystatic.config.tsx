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
        'Settings': ['settings', 'labWelcome'],
        },
},
singletons: {
    settings: singleton({
      label: 'Nav Ticker Messages',
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
    labWelcome: singleton({
      label: 'Lab Welcome Messages',
      path: 'content/lab-welcome',
      schema: {
        supervisorLabel: fields.text({
          label: 'Supervisor Label',
          defaultValue: 'Supervisors:',
        }),
        messages: fields.array(
          fields.text({
            label: 'Message',
          }),
          {
            label: 'Cycling Messages',
            itemLabel: (props) => props.value,
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
      columns: ['title', 'date',], 
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
        date: fields.date({ label: 'Published Date' }),
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
      columns: ['title',], 
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
      columns: ['title', 'status'],
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
  columns: ['title', 'phaseNumber', 'category'],
  entryLayout: 'content',
  format: { contentField: 'content' },
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),

    phaseNumber: fields.integer({
      label: 'Phase Number',
      description: 'Used for ordering (1–6). Controls the 0N label and sort order.',
      validation: { isRequired: true, min: 1, max: 6 },
    }),

    phaseLabel: fields.text({
      label: 'Phase Label',
      description: 'Short label shown above the heading e.g. "Phase 01"',
      defaultValue: 'Phase 01',
    }),

    tagline: fields.text({
      label: 'Tagline / Pull Quote',
      description: 'One punchy sentence shown as a pull quote on the phase page.',
      multiline: false,
      validation: { isRequired: false },
    }),

    description: fields.text({
      label: 'Body Copy',
      description: 'The main paragraph copy for this phase.',
      multiline: true,
    }),

    methods: fields.array(
      fields.text({ label: 'Method' }),
      {
        label: 'Methods / Techniques',
        description: 'The pill tags shown at the bottom of the section.',
        itemLabel: props => props.value,
      }
    ),

    accentColor: fields.select({
      label: 'Accent Colour',
      description: 'Controls the section background / accent treatment.',
      options: [
        { label: 'Dark (ink)',        value: 'dark' },
        { label: 'Midnight (slate)',  value: 'slate' },
        { label: 'Ember (red)',       value: 'ember' },
        { label: 'Light (off-white)', value: 'light' },
        { label: 'Deep (near-black)', value: 'deep' },
      ],
      defaultValue: 'dark',
    }),

    layoutVariant: fields.select({
      label: 'Layout Variant',
      description: 'Controls the visual layout of the phase section.',
      options: [
        { label: 'Split – copy left, visual right',   value: 'split-left' },
        { label: 'Split – visual left, copy right',   value: 'split-right' },
        { label: 'Centred – full-width pull quote',   value: 'centred' },
        { label: 'Grid – 2×2 card layout',            value: 'grid' },
        { label: 'Stacked – full-width stacked',      value: 'stacked' },
      ],
      defaultValue: 'split-left',
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
        label: 'Tags',
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
        { label: 'Management',         value: 'management' },
        { label: 'Coaching',           value: 'coaching' },
        { label: 'Voice Acting',       value: 'voice-acting' },
      ],
      defaultValue: 'design',
    }),

    content: fields.markdoc({
      label: 'Extended Content (optional)',
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