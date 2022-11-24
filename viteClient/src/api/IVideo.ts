
import $http from "$http";
import { useStore } from "@/store";
import {AxiosResponse} from "axios";


export const getCptaskList = (page: number = 1, size: number = 10, _search?: string): Promise<AxiosResponse<PageResp<CptaskType[]>>> => {
    return $http.post(`${useStore.state.serve.serveUrl}video/playVideoSteam`, {
      params: { page, size, _search }
    })
  }