import * as React from 'react'
import * as ReactDOM from 'react-dom'
import api from '../lib/api'
import { getToken } from '../lib/client'
// @ts-ignore
import * as cx from 'classnames'
// @ts-ignore
import { decode } from 'lightning-invoice'

const SATOSHI = 100 * 1000 * 1000
const JPY_BTC = 807793

interface State {
  balance: number,
  paymentRequest: string,
  tab: number,
  error: string
}

export default class Main extends React.Component<{}, State> {
  constructor (props: {}) {
    super(props)

    this.state = {
      balance: 0,
      paymentRequest: '',
      tab: 0,
      error: ''
    }
  }

  async componentDidMount () {
    const token = await getToken()
    const res = await api.jwt(token).get('/accounts/me')
    if (res.err) throw res.err

    this.setState({ balance: res.body.balance })
  }

  async onClick () {
    const token = await getToken()

    const res = await api.jwt(token).post('/payments', {
      body: {
        payment_request: this.state.paymentRequest
      }
    })

    if (res.err) {
      this.setState({ error: `${res.err.message}: ${res.body.error}` })
    }
  }

  onChange (e: any) {
    this.setState({
      paymentRequest: e.target.value
    })
  }

  switchTab (e: any, n: number) {
    e.preventDefault()
    this.setState({ tab: n })
  }

  tryDecodePaymentRequest (paymentRequest: string): any {
    console.log(paymentRequest)
    let decoded
    try {
      decoded = decode(paymentRequest)
    } catch (e) {
      console.error(e)
      return null
    }

    return decoded
  }

  render () {
    const decoded = this.tryDecodePaymentRequest(this.state.paymentRequest)

    return (
      <div>
        <div className='head'>
          <div className='balance'>
            ¥{ Math.floor(JPY_BTC * (this.state.balance / SATOSHI)) }
          </div>

          <div className='balance-btc'>
            { this.state.balance / SATOSHI } BTC
          </div>
        </div>

        <div className='container'>
          <div className='row menu'>
            {
              ['送る', '受け取る', '履歴'].map((label, i) => {
                return (
                  <a key={i}
                     href=''
                     onClick={ (e) => this.switchTab(e, i) }
                     className={ cx('unstyled-link col-4 menu-item', { active: this.state.tab === i }) }>
                    { label }
                  </a>
                )
              })
            }
          </div>
        </div>

        <div className='container'>
          {
            this.state.tab === 0 &&
              <form className='form-pay'>
                <div className='form-group'>
                  <label>送金コード</label>
                  <input type='text' className='form-control' placeholder='ln...' onChange={ this.onChange.bind(this) } />
                </div>

                <p>{ decoded && decoded.amount }</p>
                <p>{ this.state.error }</p>

                <button type='button' className='btn btn-primary btn-block btn-lg btn-pay' onClick={ this.onClick.bind(this) }>送金する</button>
              </form>
          }

          {
            this.state.tab === 1 &&
              <div>
                受け取る
              </div>
          }

          {
            this.state.tab === 2 &&
              <div>
                履歴
              </div>
          }
        </div>
      </div>
    )
  }
}
