require 'bundler/setup'
require 'sinatra'
require 'pony'

post '/mailer' do
# 	name-field:1
# area-info:2
# now:on
# calendar:15.07.2014
# area-info:3
  Pony.mail(:to => 'agnivalent@gmail.com',
            :from => 'no-reply@kedr.ru',
            :subject => "rerere",
            :body => params[:message])
end
