import * as Utilities from '../utilities'

describe('test for utility methods', () => {
  describe('tests for buildList', () => {
    it('builds human readable list', () => {

      const array1 = ['one', 'two', 'three']
      const array2 = ['something', 'very', 'nice', 'boring']

      expect(Utilities.buildList(array1)).toBe('one, two and three')
      expect(Utilities.buildList(array2)).toBe('something, very, nice and boring')

    })

    it('builds list with two elements', () => {

      const array = ['one', 'two']

      expect(Utilities.buildList(array)).toBe('one and two')

    })

    it('returns single element when only one', () => {

      const array = ['one']

      expect(Utilities.buildList(array)).toBe('one')

    })

    it('returns empty string when list is empty', () => {

      const array = []

      expect(Utilities.buildList(array)).toBe('')

    })
  })

  describe('tests for isEmpty', () => {
    it('returns true if object is empty', () => {
      expect(Utilities.isEmpty({})).toBeTruthy()
    })

    it('returns false if object is not empty', () => {
      expect(Utilities.isEmpty({something: 'exists'})).toBeFalsy()
    })
  })

  describe('tests for isObject', () => {
    it('returns false if not object', () => {
      expect(Utilities.isObject('string')).toBeFalsy()
      expect(Utilities.isObject(1000)).toBeFalsy()
      expect(Utilities.isObject(null)).toBeFalsy()
    })

    it('returns true if it is object', () => {
      expect(Utilities.isObject({})).toBeTruthy()
      expect(Utilities.isObject({la: 'lala'})).toBeTruthy()
    })
  })

  describe('tests for isValidJSON', () => {
    it('returns false if not valid json', () => {
      expect(Utilities.isValidJson('some string')).toBeFalsy()
      expect(Utilities.isValidJson('{bla:}')).toBeFalsy()
      expect(Utilities.isValidJson('{bla:"test"}')).toBeFalsy()
      expect(Utilities.isValidJson(null)).toBeFalsy()
      expect(Utilities.isValidJson('')).toBeFalsy()
      expect(Utilities.isValidJson(123)).toBeFalsy()
    })
    it('returns true if valid json', () => {
      expect(Utilities.isValidJson('{"bla":"test"}')).toBeTruthy()
      expect(Utilities.isValidJson('{"bla":"test", "bla2":{"test": "bla"}}')).toBeTruthy()
      expect(Utilities.isValidJson('{}')).toBeTruthy()
    })
  })

  describe('test for findIndex', () => {
    it('returns an index of an element if found', () => {

      const array = [
        {id: 1, text: 'bla'},
        {id: 2, text: 'smor'},
        {id: 3, text: 'trt'}
      ]

      expect(Utilities.findIndex(array, 'id', 2)).toEqual(1)
    })

    it('returns an index of an element with composite key', () => {

      const array = [
        {name: 'bla', type: 'one'},
        {name: 'trt', type: 'one'},
        {name: 'smor', type: 'one'},
        {name: 'smor', type: 'two'}
      ]

      expect(Utilities.findIndex(array, ['name', 'type'], {name: 'smor', type: 'one'})).toEqual(2)
    })

    it('returns -1 if not found', () => {
      expect(Utilities.findIndex([{
        id: 1, text: 'bla'
      }, {
        id: 2, text: 'smor'
      }, {
        id: 3, text: 'trt'
      }], 'id', 4)).toEqual(-1)
    })
  })

  describe('test for convertToMap', () => {
    it('converts the array into key/value pairs', () => {
      expect(Utilities.convertToMap([
        {key: 'some-key-1', value: 'some-value-1'},
        {key: 'some-key-2', value: 'some-value-2'},
        {key: 'some-key-1', value: 'last-value-1'},
        {key: 'some-key-2', value: 'some-value-2'},
        {key: 'some-key-3', value: 'some-value-3'}
      ])).toEqual({
        'some-key-1': 'last-value-1',
        'some-key-2': 'some-value-2',
        'some-key-3': 'some-value-3'
      })
    })
  })

  describe('test for intersect', () => {
    it('returns an array of intersecting elements', () => {
      expect(Utilities.intersection([1,2,3], [1,3,5,6])).toEqual([1,3])
      expect(Utilities.intersection([1,2,3], [4,5,6])).toEqual([])
      expect(Utilities.intersection([1,2,3], [2])).toEqual([2])
      expect(Utilities.intersection([], [4,5,6])).toEqual([])
      expect(Utilities.intersection()).toEqual([])
    })
  })

  describe('test for isRequest', () => {
    it('returns true', () => {
      expect(Utilities.isRequest('https://app.adjust.com/session', 'session')).toBeTruthy()
      expect(Utilities.isRequest('https://app.adjust.com/session?some=params', 'session')).toBeTruthy()
      expect(Utilities.isRequest('https://app.adjust.com/event/?some=params', 'event')).toBeTruthy()
      expect(Utilities.isRequest('https://app.adjust.com/event/', 'event')).toBeTruthy()
    })

    it('returns false', () => {
      expect(Utilities.isRequest('https://app.adjust.com/sessionnnn', 'session')).toBeFalsy()
      expect(Utilities.isRequest('https://app.adjust.com/ssession', 'session')).toBeFalsy()
    })
  })

  describe('test for getHostName', () => {
    it('returns host name', () => {
      expect(Utilities.getHostName('www.test.com?bla=truc')).toBe('test.com')
      expect(Utilities.getHostName('test.com/bla')).toBe('test.com')
      expect(Utilities.getHostName('www.test.com/bla')).toBe('test.com')
      expect(Utilities.getHostName('http://test.com/bla?truc')).toBe('test.com')
      expect(Utilities.getHostName('https://www.test.com/bla')).toBe('test.com')
      expect(Utilities.getHostName('http://www.test.com:8080/bla/truc')).toBe('test.com:8080')
      expect(Utilities.getHostName('https://test.com:8080/bla/truc?some=thing')).toBe('test.com:8080')
      expect(Utilities.getHostName()).toBe('')
    })
  })

  describe('test reducer method', () => {
    it('transforms array key,value pairs into object key:value pairs', () => {
      expect([
        ['key', 'value'],
        ['some', 'thing'],
        ['very', 'nice']
      ].reduce(Utilities.reducer, {})).toEqual({
        key: 'value',
        some: 'thing',
        very: 'nice'
      })
    })
  })

  describe('test for entries', () => {
    it('tests native implementation', () => {
      const objectEntries = Object.entries
      Object.entries = null

      expect(Utilities.entries({})).toEqual([])
      expect(Utilities.entries({bla: 'truc', run: 'fast'})).toEqual([['bla', 'truc'], ['run', 'fast']])

      Object.entries = objectEntries
    })

    it('test custom solution which produces same output as Object.entries', () => {
      expect(Utilities.entries({})).toEqual([])
      expect(Utilities.entries({bla: 'truc', run: 'fast'})).toEqual([['bla', 'truc'], ['run', 'fast']])
    })
  })

  describe('test for values', () => {
    it('tests native implementation', () => {
      const objectValues = Object.values
      Object.values = null

      expect(Utilities.values({})).toEqual([])
      expect(Utilities.values({bla: 'truc', run: 'fast'})).toEqual(['truc', 'fast'])

      Object.values = objectValues
    })

    it('test custom solution which produces same output as Object.values', () => {
      expect(Utilities.values({})).toEqual([])
      expect(Utilities.values({bla: 'truc', run: 'fast'})).toEqual(['truc', 'fast'])
    })
  })

  describe('test for global event listener', () => {

    const clickCallback = jest.fn()
    const originalAddEventListener = global.document.addEventListener
    const originalRemoveEventListener = global.document.removeEventListener
    let addEventListenerSpy
    let removeEventListenerSpy

    beforeAll(() => {
      addEventListenerSpy = jest.spyOn(global.document, 'addEventListener')
      removeEventListenerSpy = jest.spyOn(global.document, 'removeEventListener')
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    afterAll(() => {
      jest.restoreAllMocks()
      global.document.addEventListener = originalAddEventListener
      global.document.removeEventListener = originalRemoveEventListener
    })

    it('subscribes to particular global event', () => {

      Utilities.on(global.document, 'click', clickCallback)
      expect(addEventListenerSpy).toHaveBeenCalledWith('click', clickCallback, false)

      global.document.dispatchEvent(new Event('click'))

      expect(clickCallback).toHaveBeenCalledTimes(1)

      Utilities.off(global.document, 'click', clickCallback)
    })

    it('unsubscribes from particular global event', () => {

      Utilities.on(global.document, 'click', clickCallback)

      Utilities.off(global.document, 'click', clickCallback)
      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', clickCallback, false)

      global.document.dispatchEvent(new Event('click'))

      expect(clickCallback).not.toHaveBeenCalled()
    })

    it('ignores global event when event listening not supported', () => {

      Utils.setGlobalProp(global.document, 'addEventListener')
      Utils.setGlobalProp(global.document, 'removeEventListener')

      Utilities.on(global.document, 'click', clickCallback)
      expect(addEventListenerSpy).not.toHaveBeenCalled()

      global.document.dispatchEvent(new Event('click'))

      expect(clickCallback).not.toHaveBeenCalled()

      Utilities.off(global.document, 'click', clickCallback)
      expect(removeEventListenerSpy).not.toHaveBeenCalled()
    })

  })

  describe('test for Page Visibility API access', () => {

    const origHidden = global.document.hidden
    let hSpy
    let mozSpy
    let msSpy
    let oSpy
    let webkitSpy

    beforeAll(() => {
      Utils.setGlobalProp(global.document, 'hidden')
      Utils.setGlobalProp(global.document, 'mozHidden')
      Utils.setGlobalProp(global.document, 'msHidden')
      Utils.setGlobalProp(global.document, 'oHidden')
      Utils.setGlobalProp(global.document, 'webkitHidden')

      hSpy = jest.spyOn(global.document, 'hidden', 'get')
      mozSpy = jest.spyOn(global.document, 'mozHidden', 'get')
      msSpy = jest.spyOn(global.document, 'msHidden', 'get')
      oSpy = jest.spyOn(global.document, 'oHidden', 'get')
      webkitSpy = jest.spyOn(global.document, 'webkitHidden', 'get')
    })

    afterAll(() => {
      jest.restoreAllMocks()

      global.document.hidden = origHidden
      delete global.document.mozHidden
      delete global.document.msHidden
      delete global.document.oHidden
      delete global.document.webkitHidden
    })

    it('check access when hidden prop is available', () => {
      hSpy.mockReturnValueOnce(true)

      expect(Utilities.getVisibilityApiAccess()).toEqual({
        hidden: 'hidden',
        visibilityChange: 'visibilitychange'
      })
    })

    it('check access when mozHidden prop is available', () => {
      mozSpy.mockReturnValueOnce(true)

      expect(Utilities.getVisibilityApiAccess()).toEqual({
        hidden: 'mozHidden',
        visibilityChange: 'mozvisibilitychange'
      })
    })

    it('check access when msHidden prop is available', () => {
      msSpy.mockReturnValueOnce(true)

      expect(Utilities.getVisibilityApiAccess()).toEqual({
        hidden: 'msHidden',
        visibilityChange: 'msvisibilitychange'
      })
    })

    it('check access when oHidden prop is available', () => {
      oSpy.mockReturnValueOnce(true)

      expect(Utilities.getVisibilityApiAccess()).toEqual({
        hidden: 'oHidden',
        visibilityChange: 'ovisibilitychange'
      })
    })

    it('check access when webkitHidden prop is available', () => {
      webkitSpy.mockReturnValueOnce(true)

      expect(Utilities.getVisibilityApiAccess()).toEqual({
        hidden: 'webkitHidden',
        visibilityChange: 'webkitvisibilitychange'
      })
    })

    it('returns null when no access available', () => {
      expect(Utilities.getVisibilityApiAccess()).toBeNull()
    })

  })
})
