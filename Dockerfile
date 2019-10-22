#
# Copyright (C) Hitit Inc. - All Rights Reserved
#
# Unauthorized copying of this file, via any medium is strictly prohibited
# Proprietary and confidential
#
FROM nginx:1.17.2-alpine
VOLUME /tmp

COPY ./build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]