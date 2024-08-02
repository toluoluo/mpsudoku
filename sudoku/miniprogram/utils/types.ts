export interface GlobalUser{
  user_id: number,
  nick_name: string,
  avatar: string,
  level: number,
}

// 游戏步骤
export interface Step{
  index: number,    // 序号
  val: number,      //  值
  optType: number,  // 操作类型
}

// 榜单列表字段
export interface RankingsList{
  id: number,
  answer: string,
  question: string,
  level: number,
  user_no: string,
  name: string,
  avatar: string,
  nick_name: string,
  use_time: number,
  format_time: string,
}