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

  getSuggestionText = (suggestion) => {
    if (this.props.suggestionObjectTextProperty) {
      return suggestion[this.props.suggestionObjectTextProperty]
    }

    return suggestion
  }

  isSimilar = (value, suggestionText) => {
    const suggestionScore = stringScore(
      value, suggestionText, this.props.comparationFuzziness
    )

    return suggestionScore >= this.props.minimumSimilarityScore
  }

  shouldFilterSuggestions = (newSuggestions, value) => {
    return newSuggestions && newSuggestions.length &&
      value && !this.selectedSuggestion
  }

  filterSugestions = (newSuggestions, value) => {
    if (!this.shouldFilterSuggestions(newSuggestions, value)) {
      return {}
    }

    return newSuggestions.reduce((suggestions, suggestion) => {
      const suggestionText = this.getSuggestionText(suggestion)

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

AutoComplete.propTypes = {
  suggestions: React.PropTypes.array,
  value: React.PropTypes.string,
  minimumSimilarityScore: React.PropTypes.number,
  comparationFuzziness: React.PropTypes.number,
  suggestionObjectTextProperty: React.PropTypes.string,
  onChangeText: React.PropTypes.func,
  onSelect: React.PropTypes.func.isRequired,
  suggestionsWrapperStyle: React.PropTypes.any,
  suggestionStyle: React.PropTypes.any,
  suggestionTextStyle: React.PropTypes.any,
  style: React.PropTypes.any,
  inputStyle: React.PropTypes.any
}

AutoComplete.defaultProps = {
  minimumSimilarityScore: 0.45,
  comparationFuzziness: 0.5
}

export default AutoComplete
