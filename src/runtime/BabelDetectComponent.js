/**
 * A React function component "mock" to detect react-refresh's Babel transform.
 * @return {string} The component's name.
 */
function BabelDetectComponent() {
  return 'BabelDetectComponent';
}

// Call the function to prevent tree-shaking
BabelDetectComponent();
