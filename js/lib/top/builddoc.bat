@echo off
REM Note: I have classic/linear/parallel templates manually copied since Docco doesn't like to do the proper
REM copy operation on my machine. Upgrading to 'master' doesn't help.

SET TEMPLATE-PATH=docs/classic
docco -c %TEMPLATE-PATH%/docco.css -t %TEMPLATE-PATH%/docco.jst top.js