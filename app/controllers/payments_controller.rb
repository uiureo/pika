class PaymentsController < ApplicationController
  def create
    client = LndClient.shared

    p params[:payment_request]

    request = Lnrpc::SendRequest.new(
      payment_request: params[:payment_request]
    )


    res = client.send_payment_sync(request)

    render json: {
      error: res.payment_error
    }
  end
end
