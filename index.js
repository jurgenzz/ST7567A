import i2c from 'i2c-bus'

import * as consts from './lib/consts.js'
import { getLetter } from './lib/letters.js'
import { delay } from './lib/delay.js'

class LCD {
  #bus
  #address
  #cursor = [0, 0]

  constructor(address = consts.ADDRESS, port = consts.PORT) {
    this.#address = address
    this.#bus = i2c.open(port, () => {
      this.#init()
    })
  }

  #init = async () => {
    await delay(100)
    this.#writeCmd(consts.restart)
    await delay(100)

    this.#writeCmd(consts.BS)
    this.#writeCmd(consts.seg)
    this.#writeCmd(consts.com)

    this.#writeCmd(consts.regRatio)
    this.#writeCmd(consts.EV1)
    this.#writeCmd(consts.EV2)

    this.#writeCmd(consts.powerCon1)
    this.#writeCmd(consts.powerCon2)
    this.#writeCmd(consts.powerCon3)

    this.clear()

    this.#writeCmd(consts.enter_EC)
    this.#writeCmd(consts.DSM_ON)
    this.#writeCmd(consts.exit_EC)
    this.#writeCmd(consts.DT)
    this.#writeCmd(consts.BA)
    this.#writeCmd(consts.FR)

    this.#writeCmd(consts.displayON)
    this.#writeCmd(consts.startLine)
  }

  #queue = []
  #isWorking = false

  #dequeue = () => {
    if (this.#isWorking) {
      return
    }
    const fn = this.#queue.shift()

    if (fn) {
      fn()
      this.#dequeue()
    } else {
      this.#isWorking = false
    }
  }

  #writeCmd(data) {
    this.#queue.push(() => {
      this.#writeCmdQ(data, 0x00)
    })
    this.#dequeue()
  }

  #writeByte(data) {
    this.#queue.push(() => {
      this.#writeCmdQ(data, 0x40)
    })
    this.#dequeue()
  }

  #writeCmdQ(data, cmd) {
    this.#bus.writeByte(this.#address, cmd, data, (e) => {})
  }

  /**
   * clear whole display
   */
  clear() {
    for (let i = 0; i < 4; i++) {
      this.#writeCmd(0xb0 + i)
      this.#writeCmd(0x10)
      this.#writeCmd(0x00)

      for (let j = 0; j < 128; j++) {
        this.#writeByte(0x00)
      }
    }
  }

  /**
   *
   * @param {number} line
   *
   * Clear single line
   */
  clearLine(line) {
    this.#writeCmd(0xb0 + line)
    this.#writeCmd(0x10)
    this.#writeCmd(0x00)

    for (let j = 0; j < 128; j++) {
      this.#writeByte(0x00)
    }
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   *
   *
   * Set cursor position before displaying text
   */
  setCursor(x, y) {
    if (x > 17) {
      x = 17
    }
    if (y > 3) {
      y = 3
    }

    this.#cursor[0] = y
    this.#cursor[1] = x
  }

  /**
   *
   * @param {string} text
   * Displays string on LCD
   */
  display(text) {
    this.#writeCmd(0xb0 + this.#cursor[0])
    this.#writeCmd(Math.floor(0x10 + (this.#cursor[1] * 7) / 16))
    this.#writeCmd(0x00 + ((this.#cursor[1] * 7) % 16))

    for (const char of text) {
      const data = getLetter(char)

      if (!data || !data.length) {
        return // char is not present in library
      }
      for (let d of data) {
        this.#writeByte(d)
      }
    }
  }
}

export default LCD
