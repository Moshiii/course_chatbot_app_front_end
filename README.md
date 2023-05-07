npm run build之后 
用winscp copy dist 到 ec2 /var/tmp底下
然后进入aws console，ssh到 ec2
cd /usr/share/nginx/html/ && sudo rm -rf dist/ && sudo cp -r /var/tmp/dist/ .