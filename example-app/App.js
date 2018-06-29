import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AutoComplete from 'react-native-autocomplete-select'

const SAMPLE_SUGGESTIONS = [
  { value: 'value 1', label: 'suggestion 1' },
  { value: 'value 2', label: 'suggestion 2' },
  { value: 'value 3', label: 'suggestion 3' },
  { value: 'value 4', label: 'suggestion 4' },
  { value: 'value 5', label: 'suggestion 5' }
]

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedSuggestion: null,
      inputText: 's'
    }
  }

  onSelect = (selectedSuggestion) => {
    this.setState({
      selectedSuggestion,
      inputText: selectedSuggestion.label
    })
  }

  onChangeText = (inputText) => {
    this.setState({ inputText })
  }

  render () {
    return (
      <View style={styles.container}>
        <Text>Test</Text>
        <AutoComplete
          suggestions={SAMPLE_SUGGESTIONS}
          suggestionObjectTextProperty='label'
          onSelect={this.onSelect}
          onChangeText={this.onChangeText}
          label='Field Label'
          placeholder='Some Placeholder'
          value={this.state.inputText}
        />

        {
          this.state.selectedSuggestion &&
          <Text>
            Selected Suggestion: {JSON.stringify(this.state.selectedSuggestion)}
          </Text>
        }

        {
          this.state.inputText &&
          <Text>
            Current Input Text: {this.state.inputText || ''}
          </Text>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24
  }
})
