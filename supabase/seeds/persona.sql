-- Sori community seed for reusable personas
 -- profiles.location / posts.region use code values like 'nyc'
 -- handle is stored WITHOUT '@'
 
 SET session_replication_role = replica;
 
 -- Clean up target posts first
 DELETE FROM posts
 WHERE id IN (
   '8a4b3ed9-b1a7-4a79-8f2a-1be4b6d70001',
   '9c5d4fe1-c2b8-4c80-9a3b-2cf5c7e81102',
  'e1b48f0a-d1a4-4a8f-9f77-5f7f0ff8d523'
 );
 
 -- Clean up target profiles
 DELETE FROM profiles
 WHERE id IN (
   '6f4b8f0f-6df1-4d2f-9d9d-4c41b6d24a11',
  'c2bb8d0a-d1a4-4a8f-9f77-5f7f0ff8d522',
   'd1b48f0a-d1a4-4a8f-9f77-5f7f0ff8d522'
 );
 

 -- --------------------------------------------------
 -- Persona 3: 50s LA single woman, golfer, beautiful
 -- --------------------------------------------------
 INSERT INTO profiles (
   id,
   nickname,
   display_name,
   handle,
   bio,
   location,
   avatar_url,
   joined_at
 ) VALUES (
   'd1b48f0a-d1a4-4a8f-9f77-5f7f0ff8d522',
   '제니',
   '제니 더 뷰티',
   'golfer_beauty',
  'LA에서 혼자 지내는 50대 골퍼예요. 낮에는 라운딩과 레슨, 저녁에는 스킨케어와 메이크업',
   'la',
   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
   NOW()
 );
 
 INSERT INTO posts (
   id,
   user_id,
   title,
   content,
   category,
   region,
   tags,
   like_count,
   comment_count,
   created_at
 ) VALUES (
  'e1b48f0a-d1a4-4a8f-9f77-5f7f0ff8d523',
   'd1b48f0a-d1a4-4a8f-9f77-5f7f0ff8d522',
  '50대 LA 싱글의 골프 + 뷰티 + 마음관리 루틴 공유',
  'LA에서 지내다 보면 모든 게 빠르고 크고 화려해 보이는데, 막상 제 삶을 붙잡아주는 건 대단한 이벤트가 아니라 매일의 루틴이더라고요.

저는 50대이고 혼자 지내요. 예전에는 “이 나이에 뭘 새로 시작해” 같은 말에 휘둘렸는데, 요즘은 그냥 제가 저를 잘 돌보는 게 제일 멋진 일이라고 생각해요. 그래서 하루를 세 가지로 단순하게 나눠요: 몸(골프), 피부(뷰티), 마음(관계/감정).

골프는 제 체력과 자존감을 동시에 살려줘요. 라운딩을 하면 실수도 많고 멘탈이 흔들리는데, 그걸 다시 수습하는 과정이 인생이랑 닮았어요. “완벽하게 치자”가 아니라 “다음 샷을 잘 치자”로 마음을 바꾸는 연습이요.

그리고 뷰티는 단순히 예뻐지고 싶어서라기보다, 내 컨디션을 가장 빨리 체크할 수 있는 지표라서 기록해요. 수면이 부족하면 피부가 바로 티가 나고, 스트레스가 쌓이면 화장이 들뜨고요. 그래서 요즘은 과한 시술이나 유행 제품보다는, 기본 보습/자외선 차단/각질 관리처럼 ‘지키면 무조건 남는 것’ 위주로 정리했어요.

마지막으로 마음 관리는 “혼자라고 고립되지 않기”가 핵심인 것 같아요. LA는 사람은 많지만 진짜 내 이야기를 들어줄 사람은 의외로 찾기 어렵거든요. 저는 가까운 몇 명과는 자주, 넓게는 얕게. 대신 오래 가는 관계를 선택하려고 해요.

혹시 여기 계신 분들은 요즘 어떤 루틴이 가장 도움이 되나요? 해외에서 나이 들어간다는 게 가끔은 멋지고, 가끔은 쓸쓸한데… 서로 현실적인 팁도, 속마음도 편하게 나눴으면 좋겠어요.',
   'general',
   'la',
  ARRAY['LA','50대','싱글','골프','뷰티','루틴','자기관리','이민생활'],
   0,
   0,
   NOW()
 );

 -- --------------------------------------------------
 -- Persona 1: 40s NYC single woman, lonely/exhausted
 -- --------------------------------------------------
 INSERT INTO profiles (
   id,
   nickname,
   display_name,
   handle,
   bio,
   location,
   avatar_url,
   joined_at
 ) VALUES (
   '6f4b8f0f-6df1-4d2f-9d9d-4c41b6d24a11',
   '서린',
   '서린',
   'nightletters',
   '뉴욕에서 오래 살았지만 아직도 마음 둘 곳을 찾는 중. 오늘은 괜찮은 척 말고 진짜 이야기를 해보고 싶어요.',
   'nyc',
   NULL,
   NOW()
 );
 
 INSERT INTO posts (
   id,
   user_id,
   title,
   content,
   category,
   region,
   tags,
   like_count,
   comment_count,
   created_at
 ) VALUES (
   '8a4b3ed9-b1a7-4a79-8f2a-1be4b6d70001',
   '6f4b8f0f-6df1-4d2f-9d9d-4c41b6d24a11',
   '괜찮은 척하는 것도 이제는 좀 지치네요',
   '뉴욕에 오래 살았는데도 이상하게 마음 둘 곳은 점점 없어지는 것 같아요. 일하고 집에 오고, 또 버티고, 그렇게 지내다 보니 어느 순간 제가 무슨 
마음으로 살고 있는지도 잘 모르겠더라고요. 겉으로는 다들 잘 지내는 것 같고 저도 그냥 괜찮은 척하면서 살았는데, 사실은 많이 외롭고 지쳐 있어요. 
누군가 제 문제를 해결해줬으면 하는 건 아니고, 그냥 오늘은 조금 솔직한 이야기를 해보고 싶어서 여기 왔어요. 저처럼 오래 해외에서 살다 보니 마음이 
무뎌진 분들, 어떻게 버티고 계신가요?',
   'general',
   'nyc',
   ARRAY['외로움','해외생활','관계','뉴욕'],
   0,
   0,
   NOW() - INTERVAL '2 hours'
 );
 
 -- --------------------------------------------------
 -- Persona 2: 30s NYC single woman RN, regrets move
 -- --------------------------------------------------
 INSERT INTO profiles (
   id,
   nickname,
   display_name,
   handle,
   bio,
   location,
   avatar_url,
   joined_at
 ) VALUES (
   'c2bb8d0a-d1a4-4a8f-9f77-5f7f0ff8d522',
   '윤하',
   '윤하',
   'scrubsandregret',
   '뉴욕 온 지 1년 된 RN. 커리어는 잡았는데 삶은 자꾸 무너지는 느낌이라 솔직한 얘기를 나누고 싶어요.',
   'nyc',
   NULL,
   NOW()
 );
 
 INSERT INTO posts (
   id,
   user_id,
   title,
   content,
   category,
   region,
   tags,
   like_count,
   comment_count,
   created_at
 ) VALUES (
   '9c5d4fe1-c2b8-4c80-9a3b-2cf5c7e81102',
   'c2bb8d0a-d1a4-4a8f-9f77-5f7f0ff8d522',
   '뉴욕 온 지 1년, 벌써 다른 도시로 가고 싶은 마음이 들어요',
   'RN으로 일해보겠다고 뉴욕에 온 지 이제 1년 정도 됐어요. 처음엔 여기서 버텨내면 커리어적으로도 의미가 있을 거라고 생각했는데, 요즘은 정말 내가 
왜 이 선택을 했을까 싶어요. 다른 지역 간 RN들 보면 차도 타고 집도 넓고 미국다운 삶을 사는 것 같은데 저는 아직도 룸메이트랑 살고 있고 더러운 지하철
 타는 것도 너무 지쳐요. 물가는 너무 비싸서 외식은커녕 그냥 사는 것 자체가 빠듯하고요. 스케줄도 들쭉날쭉해서 사람 만나는 것도 쉽지 않아요. 솔직히 
달라스 같은 데로 갈 걸 그랬나 싶은 후회가 계속 들어요. 저처럼 뉴욕 와서 후회해본 RN 계신가요? 남는 게 맞는지, 떠나는 게 맞는지 너무 고민돼요.',
   'jobs',
   'nyc',
   ARRAY['RN','뉴욕생활','이직고민','달라스'],
   0,
   0,
   NOW() - INTERVAL '45 minutes'
 );
 
 SET session_replication_role = DEFAULT;



 