import React, {lazy,Suspense} from 'react'
import {Redirect} from 'react-router-dom'
import Home from '../application/Home'
const RecommendComponent = lazy(() => import ('../application/Recommend')) 
const SingersComponent = lazy(() => import ('../application/Singers')) 
const RankComponent = lazy(() => import ('../application/Rank')) 
const AlbumComponent = lazy(() => import ('../application/Album')) 
const SingerComponent = lazy(() => import ('../application/Singer')) 
const SearchComponent = lazy(() => import ('../application/Search')) 
const LoginComponent = lazy(() => import  ('../application/Login'))
const UserComponent = lazy(() => import ('../application/User'))
const CommentsComponent = lazy(() => import ('../application/CommentsList'))
const FollowComponent = lazy(() => import ('../application/Follow'))

const SuspenseComponent = Component => props => {
  return (
    <Suspense fallback={null}>
      <Component {...props}></Component>
    </Suspense>
  )
}

export default [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,
        render: ()=>(
          <Redirect to="/recommend" />
        )
      },
      {
        path: "/recommend",
        component: SuspenseComponent(RecommendComponent),
        key: "recommend",
        routes: [
          {
            path: "/recommend/:id",
            component: SuspenseComponent(AlbumComponent)
          }
        ]
      },
      {
        path: "/singers",
        component: SuspenseComponent(SingersComponent),
        key: "singers",
        routes: [
          {
            path: "/singers/:id",
            component: SuspenseComponent(SingerComponent)
          }
        ]
      },
      {
        path: "/rank",
        component: SuspenseComponent(RankComponent),
        key: "rank",
        routes: [
          {
            path: "/rank/:id",
            component: SuspenseComponent(AlbumComponent)
          }
        ]
      },
      {
        path: "/comments/:id",
        exact: true,
        key: "comments",
        component: SuspenseComponent(CommentsComponent)
      },
      {
        path: "/album/:id",
        exact: true,
        key: "album",
        component: SuspenseComponent(AlbumComponent)
      },
      {
        path: "/user/:id",
        exact: true,
        key: "user",
        component: SuspenseComponent(UserComponent)
      },
      {
        path: "/follow/:id",
        exact: true,
        key: "follow",
        component: SuspenseComponent(FollowComponent)
      },
      {
        path: "/followed/:id",
        exact: true,
        key: "followed",
        component: SuspenseComponent(FollowComponent)
      },
      {
        path: "/search",
        exact: true,
        key: "search",
        component: SuspenseComponent(SearchComponent)
      },
      {
        path: "/login",
        exact: true,
        key: "login",
        component: SuspenseComponent(LoginComponent)
      }
    ]
  }
]
