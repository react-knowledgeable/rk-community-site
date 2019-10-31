# React Knowledgeable

React Knowledgeable is a fun and friendly podium to share what we learn about React.

This repo is the community site for `<RK />`.

## 🖥 Developing locally

1. Run `yarn` (or `npm install`)
2. Set up [GitHub Personal Access Token](https://github.com/settings/tokens), refer to [Authenticating with GraphQL](https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql) for requisite scope
3. Run `GITHUB_TOKEN=<WHATEVER_GITHUB_GENERATED_FOR_YOU> yarn develop` (or `GITHUB_TOKEN=<WHATEVER_GITHUB_GENERATED_FOR_YOU> npm start`)
4. Alternatively, you may create an `.env` file in your project root, and put `GITHUB_TOKEN=<WHATEVER_GITHUB_GENERATED_FOR_YOU>` inside. Then, you may run `npm start` directly. The `.env` file will be `.gitignore`d so you won't commit your `GITHUB_TOKEN`.

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
The actual cause of this error might be due to the differences between how both package managers handle things. Running `yarn` and letting the yarn resolve dependencies will fix the issue. You can then continue to use `GITHUB_TOKEN=<xxx> npm start` again.