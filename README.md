# 이 집! 맛 집? #


### 맛집 등록 사이트 ###

- gpt api와 네이버서치 api를 활용해 맛집을 검색해 등록 후, 한눈에 볼 수 있는 사이트다.

---

### 도커 실행 방법 ###

- window의 경우 powershell(cmd도 되는지 모름), linux의 경우 터미널에서

  컨테이너를 백그라운드에서 실행시키기
  
```
docker-compose up -d
```

- 컨테이너 상태 확인

  ```
  docker-compose ps
  ```

- 컨테이너 중지

  ```
  docker-compose stop #볼륨에 저장된 데이터 유지
  docker-compose down -v # 볼륨에 저장된 것까지 삭제. 이거하면 쌓아놓은 Data다 날아갑니다.
  ```
