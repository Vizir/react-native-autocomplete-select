import React, { Component } from 'react'
import { TouchableHighlight, Text, TextInput, View } from 'react-native'
import stringScore from 'string_score'
import Styles from './Styles'

class AutoComplete extends Component {
  componentDidMount () {
    this.suggestions = this.filterSugestions(
      this.props.suggestions, this.props.value
    )
  }

  componentWillUpdate (nextProps, nextState) {
    this.suggestions = this.filterSugestions(
      nextProps.suggestions, nextProps.value
    )
  }

  isSimilar = (value, suggestionText) => {
    const minimumScore = this.props.minimumSimilarityScore || 0.45

    const suggestionScore = stringScore(
      value, suggestionText, this.props.comparationFuzziness || 0.5
    )

    return suggestionScore >= minimumScore
  }

  filterSugestions = (newSuggestions, value) => {
    if (
      !newSuggestions || !newSuggestions.length ||
      !value || this.selectedSuggestion
    ) {
      return {}
    }

    return newSuggestions.reduce((suggestions, suggestion) => {
      let suggestionText
      if (this.props.textProperty) {
        suggestionText = suggestion[this.props.textProperty]
      } else {
        suggestionText = suggestion
      }

      if (!suggestionText || !this.isSimilar(value, suggestionText)) {
        return suggestions
      }

      suggestions[suggestionText] = suggestion
      return suggestions
    }, {})
  }

  onChangeText = (value) => {
    this.selectedSuggestion = false

    if (this.props.onChangeText) {
      this.props.onChangeText(value)
    }
  }

  suggestionClick = (suggestion) => () => {
    this.selectedSuggestion = true
    this.suggestions = {}
    this.props.onSelect(suggestion)
  }

  renderSuggestions = () => {
    const suggestionTexts = Object.keys(this.suggestions || {})

    if (!suggestionTexts.length) {
      return null
    }

    return (
      <View
        style={this.props.suggestionsWrapperStyle || Styles.suggestionsWrapper}
      >
        {
          suggestionTexts.map((text, index) => (
            <TouchableHighlight
              key={index}
              suggestionText={text}
              activeOpacity={0.6}
              style={this.props.suggestionStyle || Styles.suggestion}
              onPress={this.suggestionClick(this.suggestions[text])}
              underlayColor='white'
            >
              <Text
                style={this.props.suggestionTextStyle || Styles.suggestionText}
              >
                {text}
              </Text>
            </TouchableHighlight>
          ))
        }
      </View>
    )
  }

  render () {
    return (
      <View style={this.props.style || Styles.wrapper}>
        <TextInput
          {...this.props}
          onChangeText={this.onChangeText}
          style={this.props.inputStyle || Styles.input}
        />

        {this.renderSuggestions()}
      </View>
    )
  }
}

export default AutoComplete
