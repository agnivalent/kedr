require 'bundler/setup'
require 'sinatra'
require 'pony'

get '/' do
  "Hello world!"
end

post '/mailer' do
  params[:message]
  Pony.mail(:to => 'agnivalent@gmail.com',
            :from => 'no-reply@kedr.ru',
            :subject => "Обратная связь: #{params[:name]} (+7 #{params[:phone]})",
            :body => params[:message])
end
