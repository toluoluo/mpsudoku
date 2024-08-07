export interface GlobalUser{
  user_id: number,
  name: string,
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

export interface MyHonour{
  level_num: number,
  level: string,
  play_total: number,
  succ_total: number,
  fast_time: string,
  total_time: string,
  last_play_at: string,
  rate: number | string,
}

export interface MyHistory {
  id?: number,
  answer?: string,
  question?: string,
  level?: string, 
  use_time?: string,
  err_ct?: number, 
  tip_ct?: number,
  create_at?: string,
}