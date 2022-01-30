# no-lib-App (`app: board`)

라이브러리, 프레임워크 없이 웹 애플리케이션 만들기 - **게시판**

## 1. 사용 기술

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Sass-CC6699?style=flat-square&logo=Sass&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Babel-F9DC3E?style=flat-square&logo=Babel&logoColor=white" />&nbsp;<img src="https://img.shields.io/badge/Webpack-8DD6F9?style=flat-square&logo=Webpack&logoColor=white" />

## 2. 실행

### 1) Frontend

```sh
# Development
$npm start

# Production (build 파일 생성)
$npm run build
```

### 2) Backend

```sh
# Development
$npm start
```

## 3. 데모

### 게시글 목록

<img src="https://user-images.githubusercontent.com/33610315/151711039-0e629179-bc59-414a-8c83-eaac1cf4e30e.gif" alt="DEMO - Main Page (Read)" width="700" />  
<br/>

### 게시글 보기

<img src="https://user-images.githubusercontent.com/33610315/151711043-5cd79dab-f3a8-411a-9f9d-0665a957fccc.gif" alt="DEMO - Detail Page (Read)" width="700" />  
<br/>

### 게시글 작성

<img src="https://user-images.githubusercontent.com/33610315/151711046-cbb6206b-ddbd-4073-bad7-15cab278cae2.gif" alt="DEMO - Edit Page (Create)" width="700" />  
<br/>

### 게시글 수정

<img src="https://user-images.githubusercontent.com/33610315/151711044-04b1ec04-3e80-4321-a985-88e92f2904a1.gif" alt="DEMO - Edit Page (Update)" width="700" />  
<br/>

### 게시글 삭제

<img src="https://user-images.githubusercontent.com/33610315/151711047-37b7ac8d-44e3-4a63-b6ce-15159d39d752.gif" alt="DEMO - Edit Page (Delete)" width="700" />  
<br/>

## 4. 구조

```
.
├── README.md
├── backend
│   ├── front_build
│   │   └── (front build files)
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── core
│   │   │   ├── ServerError.ts
│   │   │   └── index.ts
│   │   ├── data
│   │   │   └── posts.json
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   └── utils
│   │       ├── constants.ts
│   │       ├── functions.ts
│   │       └── index.ts
│   └── tsconfig.json
├── common
│   └── types
│       └── index.ts
└── frontend
    ├── dist
    ├── package-lock.json
    ├── package.json
    ├── public
    │   └── index.html
    ├── src
    │   ├── App.ts
    │   ├── components
    │   │   ├── Board
    │   │   ├── Button
    │   │   ├── Input
    │   │   ├── Pagination
    │   │   ├── SelectBox
    │   │   ├── Span
    │   │   ├── Textarea
    │   │   └── index.ts
    │   ├── compositions
    │   │   ├── DetailPageBottomBar
    │   │   ├── DetailPageContent
    │   │   ├── EditPageBottomBar
    │   │   ├── EditPageContent
    │   │   ├── MainPageBoard
    │   │   ├── MainPageTopBar
    │   │   ├── Modal
    │   │   └── index.ts
    │   ├── core
    │   │   ├── Component
    │   │   │   ├── functions.ts
    │   │   │   ├── index.ts
    │   │   │   └── vdom.ts
    │   │   ├── CustomError
    │   │   │   └── index.ts
    │   │   ├── Router
    │   │   │   ├── functions.ts
    │   │   │   └── index.ts
    │   │   ├── RouterLink
    │   │   ├── Store
    │   │   │   ├── classes
    │   │   │   │   ├── Publisher.ts
    │   │   │   │   └── Subscriber.ts
    │   │   │   ├── editPublisher.ts
    │   │   │   ├── index.ts
    │   │   │   └── mainPublisher.ts
    │   │   └── index.ts
    │   ├── index.scss
    │   ├── index.ts
    │   ├── pages
    │   │   ├── DetailPage
    │   │   ├── EditPage
    │   │   │   └── index.ts
    │   │   ├── MainPage
    │   │   ├── NotFoundPage
    │   │   └── index.ts
    │   └── utils
    │       ├── functions
    │       │   ├── dataFetching.ts
    │       │   ├── index.ts
    │       │   ├── localStorage.ts
    │       │   └── normal.ts
    │       ├── style
    │       │   ├── common.scss
    │       │   ├── mixin.scss
    │       │   └── reset.scss
    │       └── types.ts
    ├── tsconfig.json
    └── webpack.config.js
```
