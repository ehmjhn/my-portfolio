import React from 'react'

// ---------------------------------------------------------------
//  ErrorBoundary
// ---------------------------------------------------------------
//  A "class" component, because React has no hook equivalent for
//  catching errors thrown while rendering.
//
//  Normally if a component crashes, the whole page goes white and
//  you get nothing in the console. With an ErrorBoundary you can
//  catch it and show a friendly message with a "try again" button.
//
//  How it works:
//   - getDerivedStateFromError sets hasError, which makes React
//     render the fallback instead of the children.
//   - componentDidCatch runs after, and that is where you would
//     send the error to a logging service.
// ---------------------------------------------------------------
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error, info) {
    // In a real app you would log this somewhere, e.g.
    //   console.error('Portfolio crashed:', error, info)
    // Here we just keep it visible in the console while developing.
    console.error('A component crashed:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="err-page">
          <div className="card err-card">
            <span className="err-code">500</span>
            <h2>Something broke on my end</h2>
            <p>
              This is a bug in the site, not something you did wrong. Reloading usually fixes it.
            </p>

            {this.state.message && (
              <pre className="err-msg">{this.state.message}</pre>
            )}

            <div className="err-actions">
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Reload the page
              </button>
              <button
                className="btn"
                onClick={() => {
                  this.setState({ hasError: false, message: '' })
                }}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )
    }

    // No error, so just show the page as normal.
    return this.props.children
  }
}
