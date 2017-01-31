/* global describe, it, expect, beforeEach, jest */

import React from 'react'
import { shallow } from 'enzyme'

import AutoComplete from '../'

describe('AutoComplete', () => {
  let fakeSuggestions
  beforeEach(() => {
    fakeSuggestions = [{
      text: '0.4'
    }, {
      text: '0.5'
    }, {
      text: '0.6'
    }]
  })

  it('renders correctly', () => {
    expect(shallow(
      <AutoComplete />
    )).toMatchSnapshot()
  })

  it('only renders the suggestions that have a similarity score greater than or equal to the minimum score passed', () => {
    const params = {
      value: '0.5',
      suggestions: fakeSuggestions,
      suggestionObjectTextProperty: 'text',
      minimumSimilarityScore: 0.5
    }

    const wrapper = shallow(
      <AutoComplete {...params} />
    )

    wrapper.instance().componentDidMount()
    wrapper.instance().forceUpdate()

    expect(wrapper.find('TouchableHighlight').length).toEqual(2)

    expect(wrapper.find({suggestionText: '0.5'}).length).toEqual(1)
    expect(wrapper.find({suggestionText: '0.6'}).length).toEqual(1)
  })

  it('correctly changes the rendered suggestions when receiving new props', () => {
    let params = {
      value: '0.5',
      suggestions: fakeSuggestions,
      suggestionObjectTextProperty: 'text',
      minimumSimilarityScore: 0.5
    }

    const wrapper = shallow(
      <AutoComplete {...params} />
    )

    wrapper.instance().componentDidMount()
    wrapper.instance().forceUpdate()

    expect(wrapper.find('TouchableHighlight').length).toEqual(2)

    params.value = '0.6'
    wrapper.setProps(params)

    expect(wrapper.find('TouchableHighlight').length).toEqual(1)
    expect(wrapper.find({suggestionText: '0.6'}).length).toEqual(1)
  })

  it('hides the suggestions and calls the select callback when a suggestion is selected', () => {
    const params = {
      value: '0.5',
      suggestions: fakeSuggestions,
      suggestionObjectTextProperty: 'text',
      onSelect: jest.fn(),
      minimumSimilarityScore: 0.5
    }

    const wrapper = shallow(
      <AutoComplete {...params} />
    )

    wrapper.instance().componentDidMount()
    wrapper.instance().forceUpdate()

    expect(wrapper.find('TouchableHighlight').length).toEqual(2)

    wrapper.find({suggestionText: '0.5'}).simulate('press')

    expect(params.onSelect.mock.calls.length).toEqual(1)
    expect(params.onSelect.mock.calls[0]).toEqual([{
      text: '0.5'
    }])
    wrapper.instance().forceUpdate()
    expect(wrapper.find('TouchableHighlight').length).toEqual(0)
  })

  it('correctly calls the onChangeText callback when the text changes', () => {
    const params = {
      onChangeText: jest.fn()
    }

    const wrapper = shallow(
      <AutoComplete {...params} />
    )

    wrapper.find('TextInput').simulate('changeText', 'Some Text')

    expect(params.onChangeText.mock.calls.length).toEqual(1)
    expect(params.onChangeText.mock.calls[0]).toEqual(['Some Text'])
  })
})
