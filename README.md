# React Knowledgeable

React Knowledgeable is a fun and friendly podium to share what we learn about React.

This repo is the community site for `<RK />`.

## 🖥 Developing locally

> You will need an Airtable API key to develop locally

1. Run `yarn` (or `npm install`)
2. Set up [GitHub Personal Access Token](https://github.com/settings/tokens), refer to [Authenticating with GraphQL](https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql) for requisite scope
3. Acquire Airtable API Key and Base ID and set it into your environment. Your Airtable base should have a table named `Attendees` and short string fields with "Event ID", "Github Username", "Created Date", "Name" and "Type".
4. Run `yarn start` or `npm start` (see below for variable configuration).

### API Keys

You can either create a `.env` file, or specify these keys when running the `start` command:

`GITHUB_TOKEN=XXX AIRTABLE_API_KEY=YYY ... yarn start` or `env GITHUB_TOKEN=XXX AIRTABLE_API_KEY=YYY ... npm start`

```
// .env file

GITHUB_TOKEN=XXX
AIRTABLE_API_KEY=YYY
AIRTABLE_BASE_ID=ZZZ
```

## 🎙 Talk slides

1. Go to one of the meetup pages, i.e. https://reactknowledgeable.org/meetups/1/
2. Press <kbd>p</kbd> for presentation mode
3. Paging controls: 
   - <kbd>space</kbd> or <kbd>j</kbd>: next page
   - <kbd>k</kbd>: previous page
   - digits <kbd>0</kbd> ~ <kbd>9</kbd>: respective pages

### Random things to note

If you use `npm` instead of `yarn`, you may run into the following error:

```
The above error occurred in the <StoreStateProvider> component:
    in StoreStateProvider
    in App

React will try to recreate this component tree from scratch using the error boundary you provided, App.
Warning: App: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.
```
The actual cause of this error might be due to the differences between how both package managers handle things. Running `yarn` and letting the yarn resolve dependencies will fix the issue.
