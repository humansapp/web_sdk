// @flow
import {push} from './queue'
import Preferences from './preferences'
import Config from './config'
import Logger from './logger'
import {REASON_GENERAL} from './constants'

type ThirdPartySharingStatusT = 'pending' | 'on' | 'off'

/**
 * Log messages used in different scenarios
 *
 * @type {Object}
 * @private
 */
const _logMessages = {
  running: 'Adjust SDK is running pending third-party sharing opt-out request',
  delayed: 'Adjust SDK will run third-party sharing opt-out request after initialisation',
  pending: 'Adjust SDK already queued third-party sharing opt-out request',
  off: 'Third-party sharing opt-out is already done'
}

/**
 * Get the status of the third-party sharing
 *
 * @returns {string}
 * @private
 */
function _status (): ThirdPartySharingStatusT {
  const disabled = Preferences.getThirdPartySharing() || {}

  if (disabled.reason) {
    return disabled.pending ? 'pending' : 'off'
  }

  return 'on'
}

/**
 * Request third-party sharing opt-out request
 *
 * @param {boolean} force
 * @returns {boolean}
 */
function optOut (force?: boolean) {
  let status = _status()

  if (!force && status !== 'on') {
    Logger.log(_logMessages[status])
    return false
  }

  if (!Config.isInitialised()) {
    Logger.log(_logMessages.delayed)
    return true
  }

  push({
    url: '/disable_third_party_sharing',
    method: 'POST'
  })

  return true
}

/**
 * Persist the disable state for the third-party sharing
 *
 * @returns {boolean}
 */
function disable () {
  const disabled = Preferences.getThirdPartySharing() || {}

  if (disabled.reason) {
    Logger.log(_logMessages.off)
    return false
  }

  Logger.log('Third-party sharing disabled state is pending')

  Preferences.setThirdPartySharing({
    reason: REASON_GENERAL,
    pending: true
  })

  return false
}

/**
 * Finalize the third-party sharing persisting process
 *
 * @returns {boolean}
 */
function finish () {
  const disabled = Preferences.getThirdPartySharing() || {}

  if (disabled.reason && !disabled.pending) {
    Logger.log(_logMessages.off)
    return false
  }

  Logger.log('Third-party sharing disabled state is now persisted')

  Preferences.setThirdPartySharing({
    reason: REASON_GENERAL,
    pending: false
  })
}

/**
 * Check if there s pending third-party sharing opt-out request
 */
function check (): void {
  if (_status() === 'pending') {
    Logger.log(_logMessages.running)
    optOut(true)
  }
}

export {
  optOut,
  disable,
  finish,
  check
}
