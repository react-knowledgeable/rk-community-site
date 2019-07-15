import * as React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

const Layout = styled.main`
  margin: 0 auto;
  height: 100vh;
  max-width: 52rem;
  min-width: 16rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  h1 {
    margin: 0 0 0.5em;
  }

  img {
    max-height: 70vh;
    min-height: 10em;
  }

  a {
    font-weight: bold;
    font-size: 150%;
  }
`

export default () => (
  <Layout>
    <h1>Integer overflow!</h1>
    <img src={'rk-404.png'} alt="404 page not found" />
    <Link to="/" >Press here to restart</Link>
  </Layout>
)