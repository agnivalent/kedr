# encoding: utf-8
require 'bundler/setup'
require 'sinatra'
require 'pony'

post '/mailer' do
# name:тфьу
# phone:234
# now:on
# calendar:15.07.2014
# message:йауц

	message = "#{params[:name]} просит связаться по телефону #{params[:phone]} "
		
	message << (params[:now].to_s == "true") ? "сейчас" : "#{params[:calendar]} в #{params[:time]}"
	message << "\n"
	message << "Сообщение: #{params[:message]}"
	
  	Pony.mail(:to => 'agnivalent@gmail.com',
            :from => 'no-reply@kedr.ru',
            :subject => "Обратная связь: #{params[:name]}",
			:via => :sendmail,
  			:via_options => {
    			:location  => '/usr/sbin/sendmail', # defaults to 'which sendmail' or '/usr/sbin/sendmail' if 'which' fails
    			:arguments => '-t' # -t and -i are the defaults
  			},
            :body => message)
end
