#!/bin/sh

export $(xargs <.env)

ngrok http --domain=$NGROK_URL 5000