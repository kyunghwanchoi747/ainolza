-- Google/Kakao/Naver OAuth 필드 추가
ALTER TABLE `users` ADD `google_id` text;
ALTER TABLE `users` ADD `kakao_id` text;
ALTER TABLE `users` ADD `naver_id` text;
CREATE INDEX IF NOT EXISTS `users_google_id_idx` ON `users` (`google_id`);
CREATE INDEX IF NOT EXISTS `users_kakao_id_idx` ON `users` (`kakao_id`);
CREATE INDEX IF NOT EXISTS `users_naver_id_idx` ON `users` (`naver_id`);
