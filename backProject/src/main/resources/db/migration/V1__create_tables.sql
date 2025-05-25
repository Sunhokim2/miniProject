-- 이미지 데이터 컬럼 추가
ALTER TABLE restaurant_info
  ADD COLUMN image_data BYTEA,
  ADD COLUMN image_name VARCHAR(255),
  ADD COLUMN image_type VARCHAR(50),
  ADD COLUMN image_size BIGINT; 