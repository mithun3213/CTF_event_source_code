FROM ghcr.io/puppeteer/puppeteer:24

USER root

# Add user so we don't need --no-sandbox.
RUN mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser

COPY --chown=pptruser:pptruser src/ /app
RUN cd /app/ && npm install

ENV PORT=3000
ENV FLAG=flag{meow_fake_dockerfile_flag}

ENTRYPOINT ["node", "/app/index.js"]
